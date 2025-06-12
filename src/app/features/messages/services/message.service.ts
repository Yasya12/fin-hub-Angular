import { Inject, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../shared/models/interfaces/pagination.model';
import { Message } from '../models/message.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ChatUserDto } from '../models/chatUser.model';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ResponseModel } from '../../../shared/models/interfaces/response.model';
import { PresenceService, UnreadMessageUpdate } from '../../../core/services/presence.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    //Services
    private readonly platformId = inject(PLATFORM_ID);
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly presenceService = inject(PresenceService);

    //States
    private baseUrl = environment.apiUrl;
    private hubUrl = environment.hubUrl;
    private hubConnection?: HubConnection;
    paginatedResult = signal<PaginatedResult<Message[]> | undefined>(undefined);
    paginatedThreadMessages = signal<PaginatedResult<Message[]> | undefined>(undefined);

    chatUsers = signal<ChatUserDto[]>([]);

    messages = signal<number>(0);

    constructor() {
        this.loadMessages();

        this.presenceService.newUnreadMessage$
            .pipe(takeUntilDestroyed()) // для автоматичної відписки
            .subscribe(update => {
                if (update) {
                    this.handleUnreadMessageUpdate(update);
                }
            });
    }

    // ✅ Новий метод для обробки сповіщень
    private handleUnreadMessageUpdate(update: UnreadMessageUpdate) {
        this.chatUsers.update(currentUsers => {
            const userIndex = currentUsers.findIndex(u => u.username === update.senderUsername);

            if (userIndex > -1) {
                // ✅ ОНОВЛЮЄМО НЕ ТІЛЬКИ ЛІЧИЛЬНИК, А Й ДАТУ
                const updatedUser = {
                    ...currentUsers[userIndex],
                    unreadCount: update.unreadCount,
                    lastMessageSent: typeof update.lastMessageSent === 'string'
                        ? new Date(update.lastMessageSent)
                        : update.lastMessageSent // <-- Ensure Date type
                };

                const newUsers = [...currentUsers];
                newUsers[userIndex] = updatedUser;

                // Сортування тепер не потрібне тут, бо computed зробить це сам
                return newUsers;
            } else {
                this.loadUsersChat();
                return currentUsers;
            }
        });

        this.loadMessages();
    }

    // ✅ Метод, який завантажує список чатів і кладе його в сигнал
    loadUsersChat(): void {
        this.getUsersChat().subscribe(users => {
            this.chatUsers.set(users);
        });
    }

    public updateChatOnSentMessage(recipientUsername: string): void {
        this.chatUsers.update(currentUsers => {
            const userIndex = currentUsers.findIndex(u => u.username === recipientUsername);
            if (userIndex > -1) {
                const updatedUser = {
                    ...currentUsers[userIndex],
                    lastMessageSent: new Date() // Встановлюємо поточну дату як Date
                };
                const newUsers = [...currentUsers];
                newUsers[userIndex] = updatedUser;
                return newUsers;
            }
            return currentUsers;
        });
    }



    async createHubConnection(user: ResponseModel, otherUsername: string): Promise<void> {
        await this.stopHubConnection();

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
                accessTokenFactory: () => user.token
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('ReceivedMessageThread', (pagedResult: PaginatedResult<Message[]>) => {
            const newMessages = pagedResult.items ?? [];

            this.paginatedThreadMessages.update(() => {
                return {
                    items: newMessages,
                    pagination: pagedResult.pagination
                };
            });
        });


        this.hubConnection.on('NewMessage', (newMessage: Message) => {
            this.paginatedThreadMessages.update(existingData => {
                if (!existingData || !existingData.items) {
                    return {
                        items: [newMessage],
                        pagination: { currentPage: 1, itemsPerPage: 20, totalItems: 1, totalPages: 1 }
                    };
                }

                const updatedItems = [...existingData.items, newMessage];

                return {
                    items: updatedItems,
                    pagination: existingData.pagination
                };
            });
        });

        // ✅ ДОДАЙТЕ НОВИЙ СЛУХАЧ, призначений для ВІДПРАВНИКА
        this.hubConnection.on('MessagesWereReadByPeer', (readMessageIds: string[]) => {
            this.updateMessagesAsRead(readMessageIds);
        });

        try {
            await this.hubConnection.start();
        } catch (err) {
            console.error('Error establishing hub connection:', err);
        }
    }

    async acknowledgeMessagesRead(messageIds: string[]) {
        if (this.hubConnection?.state !== 'Connected' || messageIds.length === 0) return;
        try {
            await this.hubConnection.invoke('AcknowledgeMessagesRead', messageIds);
        } catch (error) {
            console.error('Error invoking AcknowledgeMessagesRead:', error);
        }
    }

    private updateMessagesAsRead(ids: string[]) {
        if (!ids || ids.length === 0) return;

        this.paginatedThreadMessages.update(currentData => {
            if (!currentData?.items) return currentData;

            const idSet = new Set(ids);

            const newItems: Message[] = currentData.items.map(msg =>
                idSet.has(msg.id)
                    ? { ...msg, dateRead: new Date().toISOString() } as unknown as Message
                    : msg
            );

            return { ...currentData, items: newItems };
        });
    }

    async stopHubConnection(): Promise<void> {
        if (this.hubConnection) {
            this.hubConnection.off('ReceivedMessageThread');
            this.hubConnection.off('NewMessage');
            if (this.hubConnection.state === HubConnectionState.Connected) {
                await this.hubConnection.stop();
            }
        }
        this.paginatedThreadMessages.set(undefined);
    }

    async sendMessageSignal(username: string, content: string): Promise<void> {
        try {
            await this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content });
        } catch (err) {
            console.error('Error sending message via Hub:', err);
        }
    }
    async getMessageThread(username: string, pageNumber: number, pageSize: number): Promise<void> {
        const messageParams = { recipientUsername: username, pageNumber, pageSize };
        try {
            await this.hubConnection?.invoke('LoadMessageThread', messageParams, username);
        } catch (err) {
            console.error('Error loading message thread via Hub:', err);
        }
    }

    loadMessages(): void {
        this.authService.setCurerntUser();

        if (!this.authService.currentUser()?.token) {
            console.warn('No user token found. Messages will not be loaded.');
            return;
        }

        this.getUnreadMessagesForUser().subscribe((data) => {
            this.messages.set(data);
        });
    }

    getMessages(pageNumber: number, pageSize: number, username: string, container: string) {
        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('username', username)
            .set('Container', container);

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
            .set('Cache-Control', 'no-cache');

        return this.http.get<Message[]>(`${this.baseUrl}/message`, {
            observe: 'response', params, headers, transferCache: { includeHeaders: ['Pagination'] }
        }).pipe(
            tap(response => {
                const paginationHeader = response.headers.get('Pagination');
                this.paginatedResult.set({
                    items: response.body ? (Array.isArray(response.body) ? response.body : [response.body]) : [],
                    pagination: JSON.parse(paginationHeader!),
                });
            }
            )
        )
    }

    sendMessage(username: string, content: string) {
        return this.http.post<Message>(`${this.baseUrl}/message`, { recipientUsername: username, content }, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        }).pipe(
            catchError((error) => {
                console.error('Error sending message:', error);
                return throwError(() => error);
            })
        );
    }

    deleteMessage(id: string) {
        return this.http.delete(`${this.baseUrl}/message/${id}`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.currentUser()?.token}`)
        }).pipe(
            catchError((error) => {
                console.error('Error deleting message:', error);
                return throwError(() => error);
            })
        );
    }

    getUsersChat(): Observable<ChatUserDto[]> {
        if (!this.authService.currentUser()?.token) {
            return of([]);
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<ChatUserDto[]>(`${this.baseUrl}/message/chat-users`, { headers });
    }

    getUnreadMessagesForUser(): Observable<number> {
        if (!this.authService.currentUser()?.token) {
            return of(0);
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        return this.http.get<number>(`${this.baseUrl}/message/all-messages-for-user`, { headers });
    }

    markMessagesAsRead(senderUsername: string): Observable<void> {
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.currentUser()?.token}`);

        // this.loadMessages();
        return this.http.post<void>(
            `${this.baseUrl}/message/mark-as-read/${senderUsername}`,
            {}, { headers }
        );


    }
}


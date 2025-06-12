import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../shared/models/interfaces/response.model';
import { sign } from 'crypto';
import { BehaviorSubject } from 'rxjs';

export interface UnreadMessageUpdate {
  senderUsername: string;
  unreadCount: number;
  lastMessageSent: string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  // 👇 Додаємо змінну для зберігання стану
  private connectedUserEmail: string | null = null;

  onlineUsers = signal<string[]>([]);

  public newUnreadMessage$ = new BehaviorSubject<UnreadMessageUpdate | null>(null);

  constructor() {
    // ✅ Створюємо ефект, який буде порівнювати старий і новий списки користувачів
    effect((onCleanup) => {
      const currentUsers = this.onlineUsers();
      let previousUsers = new Set<string>();

      // Функція onCleanup дозволяє нам отримати доступ до попереднього стану
      onCleanup(() => {
        previousUsers = new Set(currentUsers);
      });

      // Ігноруємо перший запуск, коли previousUsers порожній
      if (previousUsers.size === 0) {
        return;
      }

      const currentUsersSet = new Set(currentUsers);

      // Визначаємо, хто з'явився онлайн
      for (const user of currentUsers) {
        if (!previousUsers.has(user) && user !== this.connectedUserEmail) {
        //  this.toastr.info(`${user} is online`);
        }
      }

      // Визначаємо, хто вийшов
      for (const user of previousUsers) {
        if (!currentUsersSet.has(user)) {
        //  this.toastr.warning(`${user} is offline`);
        }
      }
    });
  }

  async createHubConnection(user: ResponseModel): Promise<void> {
    // ✅ КРОК 1: Ігноруємо виклик, якщо ми ВЖЕ підключені для цього ж користувача
    if (this.hubConnection?.state === HubConnectionState.Connected && this.connectedUserEmail === user.user.email) {
      console.log('Presence service already connected for this user. Ignoring request.');
      return; // Виходимо з функції, нічого не роблячи
    }

    // Зупиняємо попереднє з'єднання, якщо воно було для іншого юзера або в іншому стані
    if (this.hubConnection) {
      await this.hubConnection.stop().catch(error => console.error('Error stopping previous connection:', error));
    }

    // Створюємо нове з'єднання
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    // Встановлюємо слухачі подій
    this.hubConnection.on('UserIsOnline', (username: string) => {
      // Перевіряємо, чи поточний користувач не є відправником
      if (user.user.email !== username) {
        //this.toastr.info(`${username} is online`);
      }
    });

    this.hubConnection.on('UserIsOffline', (username: string) => {
      // ✅ ДОДАНО: Така ж перевірка для офлайн-події
      if (user.user.email !== username) {
//this.toastr.warning(`${username} is offline`);
      }
    });

    this.hubConnection.on('GetOnlineUsers', (email: string[]) => {
      this.onlineUsers.set(email);
    });

    this.hubConnection.on('NewMessageReceived', (update: UnreadMessageUpdate) => {
      console.log('PresenceService received a new message notification:', update);
      // Кладемо отримані дані в BehaviorSubject, щоб інші сервіси могли їх отримати
      this.newUnreadMessage$.next(update);
    });

    // Запускаємо нове з'єднання
    try {
      await this.hubConnection.start();
      // ✅ КРОК 2: Зберігаємо email користувача, для якого встановлено з'єднання
      this.connectedUserEmail = user.user.email;
    } catch (error) {
    //  this.toastr.error('Failed to connect to presence hub');
      console.error(error);
      this.connectedUserEmail = null; // Скидаємо стан у разі помилки
    }
  }

  async stopHubConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      await this.hubConnection.stop().catch(error => console.error('Error disconnecting from presence hub:', error));
    }
    // ✅ КРОК 3: Скидаємо стан при виході
    this.connectedUserEmail = null;
  }
}
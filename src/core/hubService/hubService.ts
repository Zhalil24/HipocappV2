import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_BASE_URL, getAccessToken } from "../services/apiConfig";

export class SignalRService {
    private connection: HubConnection | null = null;
    private readonly hubUrl = `${API_BASE_URL}/hubs/chat`;
    private readonly joinedGroups = new Set<number>();
    private reconnectedHandler: (() => void) | null = null;

    public async startConnection() {
        if (this.connection) return; // Zaten bağlantı varsa tekrar başlatma

        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl, { accessTokenFactory: getAccessToken })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        // Group membership belongs to a connection, so a new connection must join again.
        this.connection.onreconnected(async () => {
            for (const groupId of this.joinedGroups) {
                await this.invoke("JoinGroup", groupId);
            }
            this.reconnectedHandler?.();
        });

        try {
            await this.connection.start();
        } catch (err) {
            this.connection = null;
            console.error("❌ SignalR bağlantı hatası:", err);
        }
    }

    public onReconnected(handler: () => void) {
        this.reconnectedHandler = handler;
    }

    public async joinGroup(groupId: number) {
        await this.startConnection();
        await this.invoke("JoinGroup", groupId);
        this.joinedGroups.add(groupId);
    }

    /**
     * Sunucudan gelecek mesajları dinler.
     */
    public on(methodName: string, callback: (...args: any[]) => void) {
        if (!this.connection) {
            console.error("⚠ Bağlantı henüz başlatılmadı.");
            return;
        }
        this.connection.on(methodName, callback);
    }

    /**
     * Sunucuya method çağırır.
     */
    public async invoke<T = any>(methodName: string, ...args: any[]): Promise<T | undefined> {
        if (!this.connection) {
            console.error("⚠ Bağlantı henüz başlatılmadı.");
            return undefined;
        }

        try {
            return await this.connection.invoke<T>(methodName, ...args);
        } catch (err) {
            console.error(`❌ ${methodName} çağrısında hata:`, err);
            return undefined;
        }
    }

    public off(methodName: string, cb?: (...a: any[]) => void) {
        if (!this.connection) return;
        cb ? this.connection.off(methodName, cb) : this.connection.off(methodName);
    }

    /**
     * Bağlantıyı kapatır.
     */
    public async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            this.joinedGroups.clear();
        }
    }
}

export default new SignalRService();

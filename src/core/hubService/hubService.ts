import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export class SignalRService {
    private connection: HubConnection | null = null;
    private readonly hubUrl = "https://hipocapp.com/exampleTypeSafeHub";


    public async startConnection() {
        if (this.connection) return; // Zaten bağlantı varsa tekrar başlatma

        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        try {
            await this.connection.start();
            console.log("✅ SignalR bağlantısı kuruldu:", this.hubUrl);
        } catch (err) {
            console.error("❌ SignalR bağlantı hatası:", err);
        }
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
            const result = await this.connection.invoke(methodName, ...args);
            if (result === undefined) {
                console.warn(`ℹ ${methodName} çağrısı herhangi bir değer döndürmedi.`);
            }
            return result as T;
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
            console.log("🔌 SignalR bağlantısı kapatıldı.");
        }
    }
}

export default new SignalRService();


interface BluetoothTransferData {
  type: 'money_transfer';
  amount: string;
  currency: string;
  fromUserId: string;
  toUserId: string;
  walletType: 'fiat' | 'crypto' | 'credits';
  timestamp: number;
  signature: string;
}

interface BluetoothDiscoveryResult {
  deviceId: string;
  deviceName: string;
  userId?: string;
  walletAddress?: string;
}

class BluetoothMoneyTransfer {
  private isConnected = false;
  private connectedDevice: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  
  // Grova's custom service UUID for money transfers
  private readonly SERVICE_UUID = '12345678-1234-5678-9012-123456789abc';
  private readonly CHARACTERISTIC_UUID = '87654321-4321-8765-2109-cba987654321';

  async isBluetoothAvailable(): Promise<boolean> {
    if (!navigator.bluetooth) {
      console.log('Bluetooth not supported');
      return false;
    }
    
    try {
      const available = await navigator.bluetooth.getAvailability();
      return available;
    } catch (error) {
      console.error('Error checking Bluetooth availability:', error);
      return false;
    }
  }

  async requestBluetoothPermission(): Promise<boolean> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [this.SERVICE_UUID] }
        ],
        optionalServices: [this.SERVICE_UUID]
      });
      
      console.log('Bluetooth device selected:', device.name);
      return true;
    } catch (error) {
      console.error('Bluetooth permission denied:', error);
      return false;
    }
  }

  async scanForGrovaDevices(): Promise<BluetoothDiscoveryResult[]> {
    try {
      const devices = await navigator.bluetooth.getDevices();
      const grovaDevices: BluetoothDiscoveryResult[] = [];
      
      for (const device of devices) {
        if (device.name?.includes('Grova') || device.name?.includes('Money')) {
          grovaDevices.push({
            deviceId: device.id,
            deviceName: device.name || 'Unknown Device',
            userId: device.name?.split('-')[1] || undefined
          });
        }
      }
      
      return grovaDevices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return [];
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [this.SERVICE_UUID] }]
      });
      
      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');
      
      const service = await server.getPrimaryService(this.SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
      
      this.connectedDevice = device;
      this.isConnected = true;
      
      // Listen for incoming transfers
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', 
        this.handleIncomingTransfer.bind(this));
      
      console.log('Connected to Grova device:', device.name);
      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      return false;
    }
  }

  async sendMoneyTransfer(transferData: Omit<BluetoothTransferData, 'timestamp' | 'signature'>): Promise<boolean> {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Not connected to any device');
    }

    try {
      const completeTransferData: BluetoothTransferData = {
        ...transferData,
        timestamp: Date.now(),
        signature: this.generateSignature(transferData)
      };

      const dataString = JSON.stringify(completeTransferData);
      const encoder = new TextEncoder();
      const data = encoder.encode(dataString);

      await this.characteristic.writeValue(data);
      console.log('Money transfer sent via Bluetooth');
      return true;
    } catch (error) {
      console.error('Error sending money transfer:', error);
      return false;
    }
  }

  private handleIncomingTransfer(event: Event) {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value) return;
    
    try {
      const decoder = new TextDecoder();
      const dataString = decoder.decode(value);
      const transferData: BluetoothTransferData = JSON.parse(dataString);
      
      // Verify signature
      if (!this.verifySignature(transferData)) {
        console.error('Invalid transfer signature');
        return;
      }
      
      // Emit custom event for the app to handle
      const transferEvent = new CustomEvent('bluetoothMoneyTransfer', {
        detail: transferData
      });
      window.dispatchEvent(transferEvent);
      
      console.log('Received money transfer via Bluetooth:', transferData);
    } catch (error) {
      console.error('Error parsing incoming transfer:', error);
    }
  }

  private generateSignature(data: any): string {
    // In production, use proper cryptographic signing
    const dataString = JSON.stringify(data);
    return btoa(dataString).substring(0, 32);
  }

  private verifySignature(data: BluetoothTransferData): boolean {
    // In production, use proper cryptographic verification
    const { signature, ...dataWithoutSignature } = data;
    const expectedSignature = this.generateSignature(dataWithoutSignature);
    return signature === expectedSignature;
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice?.gatt?.connected) {
      await this.connectedDevice.gatt.disconnect();
    }
    
    this.isConnected = false;
    this.connectedDevice = null;
    this.characteristic = null;
    console.log('Disconnected from Bluetooth device');
  }

  async startAdvertising(userId: string): Promise<void> {
    // Note: Web Bluetooth API doesn't support advertising
    // This would need to be implemented with a native app or service worker
    console.log('Starting Bluetooth advertising for user:', userId);
  }
}

export const bluetoothTransfer = new BluetoothMoneyTransfer();
export type { BluetoothTransferData, BluetoothDiscoveryResult };

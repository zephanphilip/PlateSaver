import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { General } from '../constants';

// Configure how notifications should be presented when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Send email via API - keep only this version
async function sendEmailNotification(userEmail, message, item) {
  try {
    const response = await fetch(`${General.API_BASE_URL}api/notification/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
        message,
        item
      })
    });
    
    const data = await response.json();
    console.log('Email notification response:', data);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Check for expired items and send notifications
export async function checkExpiryAndNotify(items, userEmail) { 
  const currentDate = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(currentDate.getDate() + 2);

  items.forEach(async (item) => {
    const expiryDate = new Date(item.expires);
    let message = '';
    console.log('hy');
    if ((expiryDate < currentDate)&&(!item.notified)) {
      message = `${item.name} has expired!`;
    } else if ((expiryDate <= twoDaysFromNow)&&(!item.notified)) {
      const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
      message = `${item.name} will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`;
    }

    if (message) {
      await Promise.all([
        scheduleNotification(message, item),
        sendEmailNotification(userEmail, message, item),
        updateNotificationStatus(item._id)
      ]);
    }
  });
}

async function updateNotificationStatus(itemId) {
  try {
    const response = await fetch(`${General.API_BASE_URL}api/items/update-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
}

// Schedule a notification
async function scheduleNotification(message, item) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Item Expiry Alert! 🔔",
      body: message,
      data: { itemId: item._id },
    },
    trigger: null, // null means send immediately
  });
}
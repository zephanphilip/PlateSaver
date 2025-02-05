
import General from "../constants/General";

// Keep track of notifications sent in the current session
const notificationsSent = new Set();

// Send email via API
async function sendEmailNotification(userEmail, message, item) {
  // Create a unique key for this notification
  const notificationKey = `${item._id}-${message}`;
  
  // Check if we've already sent this notification
  if (notificationsSent.has(notificationKey)) {
    console.log(`[DEBUG] Notification already sent for item ${item._id}, skipping`);
    return;
  }

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
    
    // Mark this notification as sent
    notificationsSent.add(notificationKey);
    
    console.log(`[DEBUG] Email sent successfully for item ${item._id}:`, data);
    return data;
  } catch (error) {
    console.error(`[DEBUG] Error sending email for item ${item._id}:`, error);
    throw error;
  }
}

// Check for expired items and send notifications
export async function checkExpiryAndNotify(items, userEmail) {
  if (!items || !userEmail) {
    console.log('[DEBUG] Missing items or userEmail, skipping notifications');
    return;
  }

  console.log('[DEBUG] Starting checkExpiryAndNotify with items:', items.length);
  
  const currentDate = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(currentDate.getDate() + 2);

  await Promise.all(
    items.map(async (item) => {
      if (!item._id || item.notified) {
        return;
      }

      const expiryDate = new Date(item.expires);
      let message = '';

      if (expiryDate < currentDate) {
        message = `${item.name} has expired!`;
      } else if (expiryDate <= twoDaysFromNow) {
        const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
        message = `${item.name} will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`;
      }

      if (message) {
        try {
          // First update the notification status
          await updateNotificationStatus(item._id);
          // Then send the email
          await sendEmailNotification(userEmail, message, item);
        } catch (error) {
          console.error(`[DEBUG] Error processing notification for item ${item._id}:`, error);
        }
      }
    })
  );
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
    console.error(`[DEBUG] Error updating notification status for item ${itemId}:`, error);
    throw error;
  }
}

// Optional: Clear the notification tracking (call this when appropriate)
export function clearNotificationTracking() {
  notificationsSent.clear();
}
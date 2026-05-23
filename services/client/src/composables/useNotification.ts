import { toast } from 'vue-sonner'
import { defineComponent, h, shallowRef } from 'vue'
import MessageCardVue from '@/components/cards/MessageCard.vue'
import type { DefineComponent } from 'vue'

export function useNotification() {
  type NotificationType = 'general' | 'warning' | 'error' | 'success'
  
  interface RawNotification {
    title: string
    message: string
    type: NotificationType
  }

  interface HtmlNotification {
    type: NotificationType
    component: DefineComponent
  }

  function _trigger(notification: HtmlNotification) {
    
    toast(shallowRef(notification.component));
  }

  function _mapTypeToColor(type: NotificationType): string {
    switch (type) {
    case 'general':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    default:
      return 'primary';
    }
  }

  function _renderNotifictaion(title: string, message: string, type: NotificationType): HtmlNotification {
    const notification: RawNotification = { title, message, type }

    const _message = `<b>${notification.title}</b>. <p>${notification.message}</p>`;
    
    // generate a component that renders html
    const component: DefineComponent = defineComponent({
      render() {
        return h(MessageCardVue, { message: _message, color: _mapTypeToColor(notification.type), htmlIsh: true });
      }
    })

    return { type, component };
  }

  function notify(title: string, message: string, type: NotificationType = 'general') {
    const notification: HtmlNotification = _renderNotifictaion(title, message, type);
    _trigger(notification)
  }

  return {
    notify
  }
}

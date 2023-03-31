import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores';
import { fetchApi } from '@/util';
import type { IUser } from '@/stores';

export interface IThought {
  _id: string;
  author: IUser;
  text: string;
  createdAt: string;
}

export const useStatusStore = defineStore('thought', () => {
  const _thoughts = ref<IThought[]>([]);

  const thoughts = computed<IThought[]>(() => {
    // sort by latest thought
    return _thoughts.value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });


  async function postStatus(text: string) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const res = await fetchApi('/thoughts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: text
      })
    });

    if(!res.ok){
      const { message } = await res.json();
      throw new Error(message);
    }

    const thought = await res.json();

    _thoughts.value.push(thought);

    return thought;
  }

  async function fetchThoughts() {
    const res = await fetchApi('/thoughts');

    if(!res.ok){
      const { message } = await res.json();
      throw new Error(message);
    }

    _thoughts.value = await res.json();

    return _thoughts.value;
  }

  return {
    thoughts,
    postStatus,
    fetchThoughts
  }
});
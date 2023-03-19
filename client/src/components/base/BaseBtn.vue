<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: undefined
  },
  block: {
    type: Boolean,
    default: undefined
  },
  elevation: {
    type: String,
    default: undefined
  },
  /* sizes */
  small: {
    type: Boolean,
    default: undefined
  },
  large: {
    type: Boolean,
    default: undefined
  },
  /* styles */
  flat: {
    type: Boolean,
    default: undefined
  },
  outlined: {
    type: Boolean,
    default: undefined
  },
  text: {
    type: Boolean,
    default: undefined
  },
  tonal: {
    type: Boolean,
    default: undefined
  },
  plain: {
    type: Boolean,
    default: undefined
  },
  icon: {
    type: String,
    default: undefined
  },
  rounded: {
    type: String,
    default: undefined
  },
  /* actionability */
  disabled: {
    type: Boolean,
    default: undefined
  },
  to: {
    type: String,
    default: undefined
  }
});

const emit = defineEmits([ 'click' ]);

type ButtonStyle = 'outlined' | 'tonal' | 'plain' | 'text';
const getButtonStyle: ComputedRef<ButtonStyle | undefined> = computed(() => {
  
  if (props.outlined === true) {
    return 'outlined';
  } else if (props.text === true || props.icon !== undefined) {
    return 'text';
  } else if (props.tonal === true) {
    return 'tonal';
  } else if (props.plain === true) {
    return 'plain';
  } else {
    return undefined
  }
});

type ButtonSize = 'small' | 'medium' | 'large';
const getButtonSize: ComputedRef<ButtonSize> = computed(() => {
  if (props.small) {
    return 'small';
  } else if (props.large) {
    return 'large';
  } else {
    return 'medium';
  }
});

function handleClick() {
  // emit click event
  emit('click')
}
</script>

<template>
  <v-btn
    flat
    :variant="getButtonStyle"
    :elevation="props.elevation"
    :color="props.color"
    :size="getButtonSize"
    :block="props.block"
    :rounded="props.rounded"
    :prepend-icon="props.icon"
    :disabled="props.disabled"
    :to="props.to"
    class="pa-2"
    @click="handleClick()">
    <slot />
  </v-btn>
</template>
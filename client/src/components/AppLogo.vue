<script setup lang="ts">
import type { PropType } from 'vue'
import Logo from '@/assets/images/logo.svg'
import BaseImage from '@/components/base/BaseImage.vue'

type LogoSize = 'small' | 'medium' | 'large'

const props = defineProps({
  size: {
    type: String as PropType<LogoSize>,
    default: 'medium'
  }
})

const style = getLogo(props.size)

interface AppLogo {
  src: string
  height: string
}
function getLogo(size: LogoSize): AppLogo {
  let pixels: number = 50; // medium default
  
  if(size === 'small'){
    pixels = 25;
  }
  
  if(size === 'large'){
    pixels = 75;
  }

  // medium
  return {
    src: Logo,
    height: `${pixels}px`
  }
}
</script>

<template>
  <base-image
    :src="style.src"
    :height="style.height"/>
</template>

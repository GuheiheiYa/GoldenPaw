<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { seedAllStores } from '@/mock/seed'

onLaunch(() => {
  console.log('GoldenPaw App Launched')
  seedAllStores()
})
</script>

<style lang="scss">
@import '@/styles/reset.scss';
@import '@/styles/design-system.scss';
</style>

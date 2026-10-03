<script setup>
import { onMounted } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { sections } from '@/config';

import HeroSection from '@/components/sections/HeroSection.vue';
import BabyProfile from '@/components/sections/BabyProfile.vue';
import BirthInfo from '@/components/sections/BirthInfo.vue';
import AgeCounterSection from '@/components/sections/AgeCounterSection.vue';
import StorySection from '@/components/sections/StorySection.vue';
import DoctorSection from '@/components/sections/DoctorSection.vue';
import TimelineSection from '@/components/sections/TimelineSection.vue';
import GallerySection from '@/components/sections/GallerySection.vue';
import StatsSection from '@/components/sections/StatsSection.vue';
import WishesSection from '@/components/sections/WishesSection.vue';
import GiftSection from '@/components/sections/GiftSection.vue';
import LocationSection from '@/components/sections/LocationSection.vue';
import ShareBar from '@/components/sections/ShareBar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const baby = useBabyStore();
onMounted(() => baby.fetch());

// Bagian mana yang tampil diatur di site.config.js -> sections.
// Kartu dokter ikut bagian Lokasi; bila Lokasi dimatikan, dokter tampil
// sebagai bagian tersendiri.
const s = sections;
</script>

<template>
  <div>
    <HeroSection />
    <BabyProfile v-if="s.profile" />
    <BirthInfo v-if="s.birthInfo" />
    <AgeCounterSection v-if="s.ageCounter" />
    <StorySection v-if="s.story" />
    <TimelineSection v-if="s.timeline" />
    <GallerySection v-if="s.gallery" />
    <GiftSection v-if="s.gift" />
    <LocationSection v-if="s.location" />
    <DoctorSection v-else-if="s.doctors" />
    <StatsSection v-if="s.stats" />
    <WishesSection v-if="s.wishes" />
    <ShareBar v-if="s.share" />
    <AppFooter />
  </div>
</template>

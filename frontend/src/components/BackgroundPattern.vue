<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50"></div>
    
    <!-- Floating icons -->
    <div class="absolute inset-0">
      <!-- Top left area -->
      <div class="absolute top-20 left-10 text-emerald-300/60">
        <Building2 :size="32" class="transform rotate-12" />
      </div>
      <div class="absolute top-32 left-20 text-emerald-300/50">
        <FileText :size="28" class="transform -rotate-6" />
      </div>
      <div class="absolute top-40 left-8 text-emerald-300/55">
        <RefreshCw :size="24" class="transform rotate-45" />
      </div>
      <div class="absolute top-60 left-16 text-emerald-300/45">
        <Users :size="30" class="transform -rotate-12" />
      </div>
      <div class="absolute top-80 left-12 text-emerald-300/50">
        <Settings :size="26" class="transform rotate-30" />
      </div>
      <div class="absolute top-96 left-24 text-emerald-300/55">
        <TestTube :size="22" class="transform -rotate-45" />
      </div>

      <!-- Top right area -->
      <div class="absolute top-16 right-16 text-sky-300/60">
        <Globe :size="34" class="transform -rotate-12" />
      </div>
      <div class="absolute top-28 right-8 text-sky-300/50">
        <Heart :size="28" class="transform rotate-20" />
      </div>
      <div class="absolute top-44 right-20 text-sky-300/55">
        <BarChart3 :size="32" class="transform -rotate-30" />
      </div>
      <div class="absolute top-64 right-12 text-sky-300/45">
        <Droplets :size="24" class="transform rotate-45" />
      </div>
      <div class="absolute top-80 right-24 text-sky-300/50">
        <Plus :size="30" class="transform -rotate-20" />
      </div>
      <div class="absolute top-96 right-6 text-sky-300/55">
        <Hand :size="28" class="transform rotate-60" />
      </div>

      <!-- Middle left area -->
      <div class="absolute top-1/2 left-6 text-emerald-300/45">
        <Shield :size="36" class="transform -rotate-15" />
      </div>
      <div class="absolute top-1/2 left-32 text-emerald-300/50">
        <Calendar :size="30" class="transform rotate-25" />
      </div>
      <div class="absolute top-1/2 left-48 text-emerald-300/55">
        <Clock :size="28" class="transform -rotate-40" />
      </div>

      <!-- Middle right area -->
      <div class="absolute top-1/2 right-8 text-sky-300/50">
        <Database :size="32" class="transform rotate-35" />
      </div>
      <div class="absolute top-1/2 right-28 text-sky-300/45">
        <Layers :size="34" class="transform -rotate-25" />
      </div>
      <div class="absolute top-1/2 right-44 text-sky-300/55">
        <Zap :size="26" class="transform rotate-50" />
      </div>

      <!-- Bottom left area -->
      <div class="absolute bottom-20 left-14 text-emerald-300/50">
        <PieChart :size="32" class="transform -rotate-20" />
      </div>
      <div class="absolute bottom-32 left-4 text-emerald-300/45">
        <TrendingUp :size="28" class="transform rotate-40" />
      </div>
      <div class="absolute bottom-48 left-24 text-emerald-300/55">
        <Target :size="30" class="transform -rotate-35" />
      </div>
      <div class="absolute bottom-64 left-8 text-emerald-300/50">
        <Star :size="26" class="transform rotate-15" />
      </div>

      <!-- Bottom right area -->
      <div class="absolute bottom-16 right-20 text-sky-300/55">
        <Activity :size="34" class="transform rotate-30" />
      </div>
      <div class="absolute bottom-28 right-6 text-sky-300/45">
        <Award :size="30" class="transform -rotate-45" />
      </div>
      <div class="absolute bottom-44 right-32 text-sky-300/50">
        <Bookmark :size="28" class="transform rotate-60" />
      </div>
      <div class="absolute bottom-60 right-12 text-sky-300/55">
        <Flag :size="26" class="transform -rotate-25" />
      </div>

      <!-- Center scattered icons -->
      <div class="absolute top-1/3 left-1/4 text-emerald-300/40">
        <Mail :size="24" class="transform rotate-70" />
      </div>
      <div class="absolute top-1/3 right-1/4 text-sky-300/40">
        <Phone :size="26" class="transform -rotate-30" />
      </div>
      <div class="absolute top-2/3 left-1/3 text-emerald-300/45">
        <MapPin :size="28" class="transform rotate-45" />
      </div>
      <div class="absolute top-2/3 right-1/3 text-sky-300/45">
        <Camera :size="24" class="transform -rotate-60" />
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Building2, FileText, RefreshCw, Users, Settings, TestTube,
  Globe, Heart, BarChart3, Droplets, Plus, Hand,
  Shield, Calendar, Clock, Database, Layers, Zap,
  PieChart, TrendingUp, Target, Star, Activity, Award,
  Bookmark, Flag, Mail, Phone, MapPin, Camera
} from 'lucide-vue-next'

export default {
  name: 'BackgroundPattern',
  components: {
    Building2, FileText, RefreshCw, Users, Settings, TestTube,
    Globe, Heart, BarChart3, Droplets, Plus, Hand,
    Shield, Calendar, Clock, Database, Layers, Zap,
    PieChart, TrendingUp, Target, Star, Activity, Award,
    Bookmark, Flag, Mail, Phone, MapPin, Camera
  }
}
</script>

<style scoped>
/* Optional: Add subtle animations */
.absolute > div {
  transition: transform 0.3s ease;
}

.absolute > div:hover {
  transform: scale(1.1);
}
</style>

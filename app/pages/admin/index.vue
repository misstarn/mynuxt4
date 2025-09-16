<script setup>
     const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]

  const data = {
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,
    }
</script>
<template>
    <v-container>
        <v-sparkline
            :auto-line-width="data.autoLineWidth"
            :fill="data.fill"
            :gradient="data.gradient"
            :gradient-direction="data.gradientDirection"
            :line-width="data.width"
            :model-value="data.value"
            :padding="data.padding"
            :smooth="data.radius || false"
            :stroke-linecap="data.lineCap"
            :type="data.type"
            auto-draw
        ></v-sparkline>
    </v-container>
</template>
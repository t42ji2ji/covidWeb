<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://unpkg.com/tachyons@4.11.1/css/tachyons.css");

@font-face {
  font-family: jfOpen;
  src: url("./assets/text/jf-openhuninn-1.0.ttf");
}

#app {
  font-family: jfOpen, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

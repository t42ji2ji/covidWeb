<template lang="pug">
  .home
    .container(v-show="open")
      canvas(class="zdog-canvas" width="200" height="200")
      .chin 
        span 武
        span 漢
        span 肺炎
      .eng 
        span COVID
        span.orange -19
      .btn.Neumorphism(@click="clickBtn") 數據報告
    .container(v-if="!open")
      .hubGroup
        .hub
          h1.title {{data_tw.country}} 
          h4.title 尚未痊癒
            span.orange  {{(parseInt(data_tw.latest_stat_by_country[0].active_cases.replace(",",''))/parseInt(data_tw.latest_stat_by_country[0].total_cases.replace(",",""))).toFixed(2)}}
          h4.update {{twdate}}

          .Card.Neumorphism 
            h4.color 總感染人數
            h3 {{data_tw.latest_stat_by_country[0].total_cases}}
          .Card.Neumorphism 
            h4.color 今日感染
            h3 {{data_tw.latest_stat_by_country[0].new_cases}}
          .Card.Neumorphism 
            h4.color 尚未康復
            h3 {{data_tw.latest_stat_by_country[0].active_cases}}
        .hub
          h1.title World
          h4.title 尚未痊癒 
            span.orange {{(parseInt(unRecovered.replace(",",''))/parseInt(data_world.total_cases.replace(",",""))).toFixed(2)}}
          h4.update {{worlddate}}

          .Card.Neumorphism 
            h4.color 總感染人數
            h3 {{data_world.total_cases}}
          .Card.Neumorphism 
            h4.color 今日感染
            h3 {{data_world.new_cases}}
          .Card.Neumorphism 
            h4.color 尚未康復
            h3 {{unRecovered}}
      .btn.Neumorphism(@click="clickBtn") close
</template>

<script>
// @ is an alias to /src
import Zdog from "zdog";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import dayjs from "dayjs";

export default {
  name: "Home",
  data() {
    return {
      isSpinning: true,
      illo: Object,
      ticker: 0,
      cycleCount: 150,
      alt_direction: false,
      open: true,
      data_tw: {},
      data_world: {},
      timer: null
    };
  },
  computed: {
    twdate() {
      return dayjs(this.data_tw.latest_stat_by_country[0].record_date).format(
        "MM/DD hh:mm:ss"
      );
    },
    worlddate() {
      return dayjs(this.data_world.statistic_taken_at).format("MM/DD hh:mm:ss");
    },
    unRecovered() {
      // eslint-disable-next-line no-unused-vars
      function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
      var value =
        parseInt(this.data_world.total_cases.replace(",", "")) -
        parseInt(this.data_world.total_recovered.replace(",", ""));
      return formatNumber(value.toString());
    }
  },
  methods: {
    clickBtn() {
      this.open = !this.open;
    },
    createIcon() {
      // eslint-disable-next-line no-unused-vars
      clearTimeout(this.timer);
      var vm = this;
      this.illo = new Zdog.Illustration({
        // set canvas with selector
        element: ".zdog-canvas",
        dragRotate: true,
        zoom: 0.5,
        rotate: { x: Zdog.TAU / 4, y: Zdog.TAU / 6 },
        onDragStart: () => {
          vm.isSpinning = false;
        },
        onDragEnd: () => {
          vm.isSpinning = true;
        }
      });

      // add circle
      let o = new Zdog.Ellipse({
        addTo: this.illo,
        diameter: 200,
        stroke: 20,
        color: "#1f7eeb"
      });
      // add circle
      o.copy({
        diameter: 170,
        translate: { z: 40 },
        color: "#FFAE2F"
      });
      o.copy({
        diameter: 170,
        translate: { z: -40 },
        color: "#FFAE2F"
      });
      o.copy({
        diameter: 120,
        // position closer
        translate: { z: 80 }
      });
      o.copy({
        diameter: 120,
        translate: { z: -80 }
      });
      o.copy({
        diameter: 1,
        translate: { z: 120 },
        color: "#FFAE2F"
      });
      o.copy({
        diameter: 1,
        // position closer
        translate: { z: -120 },
        color: "#FFAE2F"
      });

      // update & render
      this.illo.updateRenderGraph();
      this.timer = setTimeout(() => {
        this.animate();
      }, 500);
    },
    animate() {
      if (this.isSpinning) {
        if (this.ticker == 150) {
          this.alt_direction = true;
        } else if (this.ticker == 0) {
          this.alt_direction = false;
        }
        if (!this.alt_direction) {
          this.ticker++;
        } else {
          this.ticker--;
        }

        let progress = this.ticker / this.cycleCount;
        if (progress > 0.98) {
          progress = 0.99999;
          this.isSpinning = false;
          setTimeout(
            () => {
              this.isSpinning = true;
            },
            200,
            this.isSpinning
          );
        }
        // apply easing to rotation
        let tween = Zdog.easeInOut(progress % 1, 3);
        this.illo.rotate.y = (1 - tween) * (Zdog.TAU / 6);
        this.illo.rotate.x = (1 - tween) * (Zdog.TAU / 4);
      }
      this.illo.updateRenderGraph();
      // animate next frame
      requestAnimationFrame(this.animate);
    },
    async getData() {
      var vm = this;
      axios({
        url:
          "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=Taiwan",
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "6eae5bc294msh01480cf2f278451p1dc032jsn1252f0bd2c13"
        }
      })
        .then(response => {
          vm.data_tw = response.data;
        })
        .catch(err => console.error(err));
      axios({
        url:
          "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
        method: "GET",
        headers: {
          "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
          "x-rapidapi-key": "6eae5bc294msh01480cf2f278451p1dc032jsn1252f0bd2c13"
        }
      })
        .then(response => {
          vm.data_world = response.data;
        })
        .catch(err => console.error(err));
    }
  },
  components: {},
  mounted() {
    this.getData();
    this.createIcon();
  }
};
</script>

<style lang="scss" scoped>
$blue: #1f7eeb;
$orange: #ffae2f;
.home {
  background: #1f1e23;
  height: 100vh;
  width: 100vw;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    margin-bottom: 4px;
    text-align: left;
  }
  .title {
    color: rgba(255, 255, 255, 0.698);
  }
  .update {
    margin: 0px 0px 20px 0px;
    color: rgba(255, 255, 255, 0.246);
  }
  hr {
    border: 1px solid #ffffff7c;
  }
}
canvas {
  cursor: move;
}
.chin {
  margin: 10px;
  color: #ffffff7c;
  font-size: 1.1rem;
  letter-spacing: 50px;
  margin-left: 50px;
}
.eng {
  color: white;
  font-size: 2.5rem;
  letter-spacing: 5px;
  .orange {
    color: $orange;
  }
}
.btn {
  color: rgba(255, 255, 255, 0.418);
  padding: 15px 60px;
  margin: 5rem;
  cursor: pointer;
}
.Neumorphism {
  border-radius: 8px;
  background: #1f1e23;
  box-shadow: 7px 7px 13px #18171b, -7px -7px 13px #26252b;
  &:hover {
    background: linear-gradient(145deg, #212025, #1c1b20);
    box-shadow: 7px 7px 14px #1a1a1e, -7px -7px 14px #242328;
  }
}

.Card {
  padding: 20px;
  color: rgba(255, 255, 255, 0.418);
  min-width: 200px;
  margin-bottom: 20px;
}

.color {
  color: $blue;
}

.blue {
  color: $blue;
}
.orange {
  color: $orange;
}

.hubGroup {
  display: flex;
  .hub {
    margin: 20px;
  }
}
</style>

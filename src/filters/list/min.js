export default values => {
  return Math.min(...values)
}

/**
 <div id="app">
    <span>{{ ages | min }}</span> <!-- Result: 12 -->
 </div>

 new Vue({
    el: '#app',

    data: {
        ages: [23, 19, 45, 12, 32]
    }
  });

**/

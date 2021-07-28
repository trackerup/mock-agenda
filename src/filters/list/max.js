export default values => {
  return Math.max(...values)
}

/**
 <div id="app">
    <span>{{ ages | max }}</span> <!-- Result: 45 -->
 </div>

 new Vue({
    el: '#app',

    data: {
        ages: [23, 19, 45, 12, 32]
    }
  });

 **/

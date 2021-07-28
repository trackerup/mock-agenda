export default (values) => {
  return values.filter(function (element, index, self) {
    return index == self.indexOf(element)
  })
}

/**
 <div id="app">
    <span>{{ recentViewedPosts | unique }}</span>
    <!-- Result: [13, 43, 23, 3, 98, 42, 65] -->
 </div>

 new Vue({
    el: '#app',

    data: {
        recentViewedPosts: [13, 43, 23, 13, 43, 3, 98, 42, 65]
    }
  });

 **/

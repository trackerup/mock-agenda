export default values => {
  if (Array.isArray(values)) {
    return values[0]
  }
  return values
}

/**
 <div id="app">
    <span>{{ consoles | first }}</span> <!-- Result: PlayStation -->
 </div>

 new Vue({
    el: '#app',

    data: {
        consoles: ['PlayStation', 'Nintendo DS', 'Xbox', 'Atari']
    }
  });

 **/

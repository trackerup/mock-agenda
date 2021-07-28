export default values => {
  for (let i = values.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = values[i]
    values[i] = values[j]
    values[j] = temp
  }
  return values
}

/**
 <div id="app">
    <span>{{ cards | shuffle }}</span>
    <!-- Result: ['Alexandre', 'Lahire','Judith', 'Lancelot'] -->
 </div>

 new Vue({
    el: '#app',

    data: {
        cards: ['Lahire', 'Judith', 'Lancelot', 'Alexandre']
    }
  });

 **/

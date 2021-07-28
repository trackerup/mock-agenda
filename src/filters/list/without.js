export default (values, exclude) => {
  return values.filter(element => {
    return !exclude.includes(element)
  })
}

/**
 <div id="app">
    <span>{{ unpaidInvoices | without('#1003') }}</span>
    <!-- Result: ['#1001', '#1002', '#1004'] -->
 </div>

 new Vue({
    el: '#app',

    data: {
        unpaidInvoices: ['#1001', '#1002', '#1003', '#1004']
    }
  });

 **/

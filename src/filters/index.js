import Vue from 'vue'

// Import for list filters
import Min from './list/min'
import Max from './list/max'
import Shuffle from './list/shuffle'
import First from './list/first'
import Last from './list/last'
import Without from './list/without'
import Unique from './list/unique'

// Import for string filters
import Capitalize from './string/capitalize'
import Lowercase from './string/lowercase'
import Truncate from './string/truncate'
import Uppercase from './string/uppercase'

// Import for date filters
import FormatDate from './date/formatDate'
import FormatTime from './date/formatTime'
import FormatDateTime from './date/formatDateTime'
import FormatInputDate from './date/formatInputDate'
import FormatInputDateTime from './date/formatInputDateTime'
import FormatJsonTime from './date/formatJsonTime'

// Import numbers filters
import FormatMoney from './numbers/formatMoney'

// List filters
Vue.filter('min', Min)
Vue.filter('max', Max)
Vue.filter('shuffle', Shuffle)
Vue.filter('first', First)
Vue.filter('last', Last)
Vue.filter('without', Without)
Vue.filter('unique', Unique)

// String filters
Vue.filter('capitalize', Capitalize)
Vue.filter('lowercase', Lowercase)
Vue.filter('truncate', Truncate)
Vue.filter('uppercase', Uppercase)

// Date filters
Vue.filter('formatDate', FormatDate)
Vue.filter('formatTime', FormatTime)
Vue.filter('formatDateTime', FormatDateTime)
Vue.filter('formatInputDate', FormatInputDate)
Vue.filter('formatInputDateTime', FormatInputDateTime)
Vue.filter('formatJsonTime', FormatJsonTime)

// Numbers Filters
Vue.filter('formatMoney', FormatMoney)

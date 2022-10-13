require(['jquery', '../jquery.properties.js'], ($) => {
	$(() => {

		$('.Test').Property('MyProp', function (...args) {
			console.log(this)
			console.log(args)
		})
		$('.Test').Property('OtherProp', function (...args) {
			console.log(this)
			console.log(args)
		})
		$('.Test').Property('AnotherProp', function (...args) {
			console.log(this)
			console.log(args)
		})


		$('.Test').Property('MyProp', 'MyVal')
		$('.Test').data({OtherProp: 115, AnotherProp: true})

	})
})

# ui.patternlock
jQueryUi widget of an android like pattern lock mechanisim for web apps  

## Installation

```sh
npm install @tyler.thayn/ui.patternlock
```

## Usage

```js
require(['jquery', 'ui.patternlock'], ($, PatternLock) => {
	$(() => {
		let pl = new PatternLock()
		$('button.Show').on('click', () => {
			pl.Show().then(console.log)
		})
		$('button.Confirm').on('click', () => {
			pl.Show(true).then(console.log)
		})
	})
})
```

## Api

- new PatternLock([options])
- data (string)
- options (object)
- Hide([effect] [,cb])
- Show([confirm] [,effect] [,cb]) => Promise

## Configuration

- data (string:'')
- confirm (boolean:false)
- rows (number:4)
- columns (number:4)
- width (number:calculated)
- height (number:calculated)
- showPatternLine (boolean:true)
- patternLineColor (string:'#000000')
- lineWidth (number:10)
- selectionColor (string:'#ff0000')
- fieldName (string:'')
- valueSeparator (string:',')
- valueArray (array:[])
- centerCircle (boolean:true)
- centerCircleSize (number:20)
- timeout (number:100)
- allowRepeatSelection (boolean:true)

## Events
- entered
	- data (string)
	- confirmed (boolean)
- hidden
- shown



# React Animate


What components make up the app?

App
	#preview
		Image
		Image
		...

	#timeline
		TimeSlider

		#images
			TimelineImage
				ImagePreview

				#transitions
					Transition
					Transition
					...

			TimelineImage
			...



What data represents the app?

{
	images: [
		{
			key: <ID>
			src: <URL>
			startState: {
				left: 10
				top: 100
			}
			currentState: {
				left: 90
				top: 25
			}
			transitions: [
				{
					start: 12.23
					end: 15.25
					startProperties...
				}
			]
		}
		...
	]

	time: 46.2

}




# Drawing based tweening app.

What data describes this app?

{
	frames: [
		{
			time: <Number>
			paths: [
				{
					points: [[<Number>, <Number>]]
				}
			]
		}
	]

	currentTime: <Number>

	currentFrame: {
		paths: [...]
	}
}


* When the time changes, currentFrame is re-interpolated.

* When a frame changes or is added, currentFrame is re-interpolated.

* When the currentFrame is directly manipulated, it will either create a new frame at the current time, or edit the frame if it exists.


# What components make up the app?

<App>
	<Canvas>
		<Path>
		<Path>
		...

	<Timeline>
		<TimeSlider>

		# previews
			<FramePreview>
			<FramePreview>
			...



App
	state: the whole state

	passes down state.currentFrame to Canvas.
	passes down state.currentTime and frames to Timeline

	listens to Canvas.onChange
	listens to Timeline.onCurrentTimeChange

	just need to implement computeCurrentFrame(frames, currentTime)

	undo/redo will be very easy to implement, because state is stored in a
	single place, and changes propagated downwards.


Canvas
	props: [currentFrame, onChange]

	<Path>

	listens to drag events and fires onChange for new paths.

	Later can implement eraser / pen modes using some state here. But still use
	the same methods to update props.


Timeline
	props: [frames, currentTime, onCurrentTimeChange]

	listens to TimeSlider.onChange
	listens to FramePreview.onClick


TimeSlider
	props: [currentTime, onChange]


FramePreview
	props: [frame]
























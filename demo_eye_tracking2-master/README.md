# Eye tracking via a webcam, version 3
This experiment demonstrates how to conduct eye tracking via a webcam using the [webgazer](https://webgazer.cs.brown.edu/) library. This verion is updated to run from 2021.2.3 onwards so please update your PsychoPy if you need to *This experiment only works online (PsychoJS) and not offline (PsychoPy)*

# General structure
The experiment consists of the following phases:
- `initializeEyetracking`, which downloads the required library (webgazer) and waits until it is ready
- `calibration`, which calibrates the eye tracker by mapping the paritipant's gaze to points on the screen that they you need to click
- `trackingTrial`, which shows a square that follows the participant's gaze

# How good is it?
In general we've found users report several considerations you might wish to make when advising participants:

- Run the experiment in a well lit room but with no light shining from behind.
- Keep your head still
- The eye tracking can require quite a lot of processing power, so it could be tough on older computers (perhaps advise closing background processes and excess tabs)
- Good calibration is very important. Accuracy seems lower at the edges of the screen than at the center. Try tweaking  `calibration_trials.xlsx`.
- In the tracking phase, accuracy seems to drop off over time. Recalibrating occassionally could address this issue.
- This experiment loads version 2.0.1 of the webgazer library, with some modifications by Thomas Pronk for checking whether the eyes are inside of the calibration square. Modified version can be found [here](https://github.com/tpronk/WebGazer)

# Relevant threads and tutorials
- The most up to date tutorials will be available [from the official PsychoPy workshop materials](https://workshops.psychopy.org/3days/day2/advancedOnline.html#advancedonline)
- Discussion about demo_eye_tracking and demo_eye_tracking2 on the [PsychoPy Forum](https://discourse.psychopy.org/t/eye-tracking-development-for-pavlovia/14667). 

Relevant to previous versions of this demo are:

- A [tutorial](https://twitter.com/HirstRj/status/1309597324591628290) on how to detect whether a participant looks left or right in five tweets.
- General discussion on eye tracking via webgazer on [Twitter](https://twitter.com/ThomasPronk123/status/1291985040168177664) and the [PsychMaps Facebook Group](https://www.facebook.com/groups/psychmap/?post_id=1163457340697853).

# Citing this experiment
To cite this demo, please use: 

PsychoPy core team (2021). Demo of Eye-Tracking via Webcam in PsychoJS (Version 3) [Computer software]. Retrieved from https://gitlab.pavlovia.org/demos/demo_eye_tracking2

# References

Pronk, T. (2020). Demo of Eye-Tracking via Webcam in PsychoJS (Version 2) [Computer software]. Retrieved from https://gitlab.pavlovia.org/tpronk/demo_eye_tracking2/ 

Papoutsaki, A., Sangkloy, P., Laskey, J., Daskalova, N., Huang, J., & Hays, J. (2016). Webgazer: Scalable webcam eye tracking using user interactions. In *Proceedings of the Twenty-Fifth International Joint Conference on Artificial Intelligence-IJCAI 2016*.

More relevant publications can be found [here](https://webgazer.cs.brown.edu/#publication)
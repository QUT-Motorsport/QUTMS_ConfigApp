// this Clock component is a great example because it encapsulates usage of the two main react hooks -
// useState and useEffect which really simplify ui development compared to past paradigms in any other framework
import { useState, useEffect } from "react";

// Hooks are functions that 'hook in' to the 'react component lifecycle'. Allowing functional react components to have
// control over their internal state, and callbacks to enable these components to "react" internally to upstream changes.

// This is called a custom hook. It is essentially a function that uses multiple standard hooks internally,
// composing them into desired functionality and simplifying the exported render code below as a pure function!
// they can also be shared between different react components.
const useNow = () => {
  // here the "useState" hook is called with the initial value of when this component was first created.
  // it returns the current value of the time, and a function that sets a new value.
  // Any time a 'setState' function is run, the component containing the function re-renders.
  const [now, setNow] = useState(new Date());

  // "useEffect" is a hook that runs after the component is first rendered, and every time any of the "effect dependencies" changes.
  useEffect(
    () => {
      // We call javascripts' inbuild "setInterval" function to update the current "now" with the "setNow" once every second.
      // We also retain a reference to the generated interval so that we can delete the interval (as the "setNow" function will no longer be valid)
      const intervalId = setInterval(() => {
        setNow(new Date());
      }, 1000);

      // if a function is returned from the useEffect callback, it is run before the effect callback is re-run due to a dependency
      // in the "effect dependencies" list changing, or if the component is no longer being rendered as the result of an upstream state changed.
      return () => clearInterval(intervalId);
    },
    // this is the "effect dependencies" list. By specifying an empty list,
    // we're letting react know that we only want to run this effect when the component is first created.
    // if we were to add "now" to the list, the effect would be run every time the component re-renders (which happens every-time "setNow" is called),
    // needlessly destroying the old interval and creating a new interval every re-render. Not specifying this list
    // results is equivalent to filling this list with every 'state-hook' variable used, re-calling on every re-render.
    []
  );

  return now;
};

export default ({ now = useNow() }) => (
  <div>Time: {now.toLocaleTimeString()}</div>
);

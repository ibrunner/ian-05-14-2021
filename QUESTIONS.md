1. What would you add to your solution if you had more time?

Performance:

- Data sorting/filtering in a web worker to pull it off the UI thread
- RxJs (and observables in general) is a great tool for "firehose" websocket applications and would make it easier to throttle
  and handle backpressure
- Throttle render updates for performance and visual consistency (capped framerate), likely using `requestAnimationFrame` in some capacity
- A library like `react-window` to only render table items in view
- Can we avoid grouping for the .5 since that's the lowest group returned?
- pause socket when window is "blurred"
- Total calculation can be more efficient by starting at index of lowest new order instead of whole list
- I reverse the sort order in the rendering component. I could do that as I build the list.

Styles:

- I tried to use the "tachyon" css framework but it proved harder to learn than just writing the css by hand
- If I used sass or less I could have used more nesting and written better classes
- The UI can get rough in certain screen sizes and I didn't have time to polish it perfectly, I would have liked to get my flexbox styles tighter and use less percentages
- I only tested on Chrome and the mobile view within Chrome dev tools

Testing:

- I tested the some of the grouping and filtering logic but none of the UI rendering
- Mocking the API and testing for data from my hooks

UI

- The prompt states "Total: the summed amount of the size at the current level and every level below it" but the example shows the opposite for bids, totalling levels above. I should have asked for clarification.

2. What would you have done differently if you knew this page was going to get thousands of views
   per second vs per week?

The front-end application should be optimized for a variety of platforms and hardware profiles. Performance, especially on mobile, needs to account for slower processors and mobile bandwidth using some methods mentioned above. CDN caching of the app bundle would be a given. Rate limiting data based on performance and bandwidth could help the client as well.

Just as important is using the API responsibly. If data can suspended when a user is on another tab it will prevent zombie sessions from hammering the back-end.

3. What was the most useful feature that was added to the latest version of your chosen language?
   Please include a snippet of code that shows how you've used it.

The biggest quality-of-life improvement recently was support for optional chaining in js when using typescript. It is so much easier to use something like:

```
some?.deeply?.nested?.value
```

instead of

```
some && some.deeply && some.deeply.nested && some.deeply.nested.value
```

4. How would you track down a performance issue in production? Have you ever had to do this?

I would collect data using the performance API and send it somewhere that is easy to monitor, aggregate, and filter like: New Relic, Grafana, or Tableau. I've used New Relic for front-end performance monitoring and have done reporting with prometheus metrics in Grafana, including developing a custom heatmap plugin.

When debugging the error it is useful to use flame graphs to isolate issues to certain processes. The performance API can be useful in debugging to manually set timers and markers. In a React app, performance issues can frequently occur when there are unnessary re-renders or state changes that trigger a loop. This is usually because of not using `useMemo` on data or not correctly adding dependencies to an effect.

5. Can you describe common security concerns to consider for a frontend developer?

- sanitizing data inputs to avoid injection attacks
- avoid putting sensitive info in cookies or localstorage
- https always
- limit third party tags, especially on pages with sensitive information - use self-hosted analytics tracking when possible
- Node packages can be especially bad for front-end apps, so tools like "dependabot" are good for getting alerts about vulnerabilities or compromised packages
- support 2fa, sso, email verification, phone verification
- serialize data before rendering to prevent XSS attacks
- revisit the OWASP top 10 for best practices

6. How would you improve the API that you just used?

- grouping on the back-end
- a way to grab a full frame instead of just deltas for resetting or interruptions

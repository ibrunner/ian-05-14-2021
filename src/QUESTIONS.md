1. What would you add to your solution if you had more time?

- Data sorting/filtering in a web worker to pull it off the UI thread
- RxJs is a great tool for "firehose" websocket applications and would make it easier to throttle
  and handle backpressure
- Throttle render updates for performance and visual consistency (capped framerate)
- Can we avoid grouping for the .5 since that's the lowest group returned?
- pause socket when window is "blurred"
- Total calculation can be more efficient by starting at index of lowest new order instead of whole list
- Could canvas be a more performant render targer than dom?
- Can we periodically do clean-up on the orders if they get too long?
- Potentially memoize grouping, but the orders are probably changing too quickly

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
   I would collect data using the performance API and send it somewhere that is easy to monitor, aggregate, and filter like: New Relic, Grafana, or Tableau. I've used New Relic for front-end performance monitoring and have done reporting with prometheus metrics in Grafana, including a custom heatmap plugin.

5. Can you describe common security concerns to consider for a frontend developer?

6. How would you improve the Kraken API that you just used?

- grouping on the back-end
- param for rate limiting

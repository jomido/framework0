Double you, eye - pea.

Expected phases:

  0. implement an entity component system (ECS) (or CES).
  1. see if an ECS + tradtional game loop is sufficient for these types of UI components (in order): logic, layout, looks. (inspiration: cycle.js, gamedev, PLC's)
  2. map entity-component-values to DOM element-attribute-values. (inspiration: a-frame)
  3. reverse the map from 2 (vDOM). (inspiration: react, inferno, snabbdom)
  4. if necessary, write a webpack loader to polish final syntax/api (hopefully not necessary)

Goals:

 0. data-driven
 1. immutable
 2. composable
 3. decomposable[1]

[1] Might be the wrong term; but the ability to easily take a thing and break it apart into smaller pieces. Or, the way things _must_ be formed makes _unforming_ easy. 
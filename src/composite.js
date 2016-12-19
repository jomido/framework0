import { Types } from './types.js'
//
// A composite is a composition of components under a new name. The name is
// semantically meaningful, as a system can be created specifically for that
// composite name. The system should only act on an entity that explicitly
// has that name; the entity may have all of the required components, but
// if it does not have the composite name, it does not apply to the system.

// composite of composites (yes or no? if yes, flatten?)

// entity.is(...<composite or composite name>)
// vs. composite.has(...<component or component name>)

// a composite is not defined _just_ by its components (and maybe composites),
// but also by its _name_.

const CompositeType = Types.get('Composite')

export { CompositeType }
interface EntitySchema<T> {
  key: keyof T;
  relations?: {
    [K in keyof T]?: {
      type: 'one' | 'many';
      entity: string;
    };
  };
}

interface NormalizedState<T> {
  entities: {
    [key: string]: {
      [id: string]: T;
    };
  };
  ids: {
    [key: string]: string[];
  };
}

type RelationType = {
  type: 'one' | 'many';
  entity: string;
};

class StateNormalizer {
  private schemas: Map<string, EntitySchema<unknown>> = new Map();

  registerSchema<T>(entityName: string, schema: EntitySchema<T>): void {
    this.schemas.set(entityName, schema as EntitySchema<unknown>);
  }

  normalize<T extends Record<string, unknown>>(entityName: string, data: T[]): NormalizedState<T> {
    const schema = this.schemas.get(entityName) as EntitySchema<T>;
    if (!schema) {
      throw new Error(`Schema not found for entity: ${entityName}`);
    }

    const state: NormalizedState<T> = {
      entities: {},
      ids: {},
    };

    // Initialize entity container
    state.entities[entityName] = {};
    state.ids[entityName] = [];

    // Process each entity
    for (const item of data) {
      const id = String(item[schema.key]);
      state.entities[entityName][id] = { ...item };
      state.ids[entityName].push(id);

      // Process relations
      if (schema.relations) {
        for (const [key, relation] of Object.entries(schema.relations) as [keyof T, RelationType][]) {
          const relationValue = item[key];
          if (!relationValue) continue;

          // Initialize relation container if needed
          if (!state.entities[relation.entity]) {
            state.entities[relation.entity] = {};
            state.ids[relation.entity] = [];
          }

          if (relation.type === 'one') {
            // Handle one-to-one relation
            const relatedItem = relationValue as Record<string, unknown>;
            const relatedSchema = this.schemas.get(relation.entity) as EntitySchema<unknown>;
            if (relatedSchema) {
              const relatedId = String(relatedItem[relatedSchema.key]);
              state.entities[relation.entity][relatedId] = relatedItem as T;
              if (!state.ids[relation.entity].includes(relatedId)) {
                state.ids[relation.entity].push(relatedId);
              }
              state.entities[entityName][id][key] = relatedId as unknown as T[keyof T];
            }
          } else {
            // Handle one-to-many relation
            const relatedItems = relationValue as Record<string, unknown>[];
            const relatedSchema = this.schemas.get(relation.entity) as EntitySchema<unknown>;
            if (relatedSchema) {
              const relatedIds = relatedItems.map(item => {
                const relatedId = String(item[relatedSchema.key]);
                state.entities[relation.entity][relatedId] = item as T;
                if (!state.ids[relation.entity].includes(relatedId)) {
                  state.ids[relation.entity].push(relatedId);
                }
                return relatedId;
              });
              state.entities[entityName][id][key] = relatedIds as unknown as T[keyof T];
            }
          }
        }
      }
    }

    return state;
  }

  denormalize<T extends Record<string, unknown>>(entityName: string, state: NormalizedState<T>): T[] {
    const schema = this.schemas.get(entityName) as EntitySchema<T>;
    if (!schema) {
      throw new Error(`Schema not found for entity: ${entityName}`);
    }

    const entities = state.entities[entityName];
    const ids = state.ids[entityName];

    return ids.map(id => {
      const entity = { ...entities[id] };

      // Process relations
      if (schema.relations) {
        for (const [key, relation] of Object.entries(schema.relations) as [keyof T, RelationType][]) {
          const relationValue = entity[key];
          if (!relationValue) continue;

          if (relation.type === 'one') {
            // Handle one-to-one relation
            const relatedId = relationValue as string;
            entity[key] = state.entities[relation.entity][relatedId] as T[keyof T];
          } else {
            // Handle one-to-many relation
            const relatedIds = relationValue as string[];
            entity[key] = relatedIds.map(
              relatedId => state.entities[relation.entity][relatedId]
            ) as T[keyof T];
          }
        }
      }

      return entity;
    });
  }

  getRelatedEntities<T extends Record<string, unknown>>(
    entityName: string,
    id: string,
    relationKey: keyof T,
    state: NormalizedState<T>
  ): T[] {
    const schema = this.schemas.get(entityName) as EntitySchema<T>;
    if (!schema?.relations?.[relationKey]) {
      throw new Error(`Relation ${String(relationKey)} not found for entity: ${entityName}`);
    }

    const relation = schema.relations[relationKey] as RelationType;
    const entity = state.entities[entityName][id];
    if (!entity) return [];

    const relationIds = entity[relationKey];
    if (!relationIds) return [];

    if (relation.type === 'one') {
      const relatedEntity = state.entities[relation.entity][relationIds as string];
      return relatedEntity ? [relatedEntity] : [];
    }

    return (relationIds as string[]).map(
      relatedId => state.entities[relation.entity][relatedId]
    );
  }
}

// Create a singleton instance
const normalizer = new StateNormalizer();

export { normalizer, type EntitySchema, type NormalizedState };

// Example usage:
/*
interface Author {
  id: number;
  name: string;
}

interface BlogPost {
  id: number;
  title: string;
  author: Author;
  comments: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: Author;
}

// Register schemas
normalizer.registerSchema<BlogPost>('posts', {
  key: 'id',
  relations: {
    author: { type: 'one', entity: 'authors' },
    comments: { type: 'many', entity: 'comments' }
  }
});

normalizer.registerSchema<Author>('authors', {
  key: 'id'
});

normalizer.registerSchema<Comment>('comments', {
  key: 'id',
  relations: {
    author: { type: 'one', entity: 'authors' }
  }
});

// Normalize data
const normalizedState = normalizer.normalize('posts', blogPosts);

// Denormalize data
const denormalizedPosts = normalizer.denormalize('posts', normalizedState);
*/ 
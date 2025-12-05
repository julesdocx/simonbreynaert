import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import tags from './tags'

export const schemaTypes = [tags, post, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [tags, post, blockContent],
}
 
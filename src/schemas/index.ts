import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import tags from './tags'
import bio from './bio'

export const schemaTypes = [bio, tags, post, blockContent]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [bio, tags, post, blockContent],
}
 
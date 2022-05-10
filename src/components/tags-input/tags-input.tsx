import React from 'react'
import ReactTags, { Tag } from 'react-tag-autocomplete'

interface TagsInputProps {
  tags: Tag[]
  color: string
  tagInputId: string
  onDelete: (i: number) => void
  onAdd: (tag: Tag) => void
}

const TagsInput = ({
  tags,
  onDelete,
  onAdd,
  color,
  tagInputId
}: TagsInputProps) => {
  return (
    <>
      <ReactTags
        inputAttributes={{ id: tagInputId }}
        tags={tags}
        handleDelete={onDelete}
        handleAddition={onAdd}
        delimiterChars={[',']}
        allowNew={true}
        placeholder='Add tags using enter'
        classNames={{
          root: 'react-tags',
          rootFocused: '',
          selected: 'react-tags__selected',
          selectedTag: `react-tags__selected-tag badge badge-pill badge-${color} m-1 border-0 text-white`,
          selectedTagName: 'react-tags__selected-tag-name',
          search: 'react-tags__search',
          searchInput: 'react-tags__search-input ml-2',
          suggestions: 'react-tags__suggestions',
          suggestionActive: 'is-active',
          suggestionDisabled: 'is-disabled'
        }}
      />
    </>
  )
}

export default TagsInput

---
# A section created with the Portfolio widget.
# This section displays content from `content/project/`.
# See https://wowchemy.com/docs/widget/portfolio/
block: collection

title: 'Recent Posts'

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 20


content:
  # Page type to display. E.g. project.
  count: 5
  # Default filter index (e.g. 0 corresponds to the first `filter_button` instance below).
  filters:
    folders:
        - posts
    author: ""
    category: ""
    tag: ""
    exclude_featured: false
    exclude_future: false
    exclude_past: false
    publication_type: ""
      # Choose how many pages you would like to offset by
  offset: 0
      # Page order: descending (desc) or ascending (asc) date.
  order: desc
design:
      # Choose a layout view
  view: compact
  columns: '2'


---

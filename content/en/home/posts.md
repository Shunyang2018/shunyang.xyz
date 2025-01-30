---
widget: pages  # Change from 'collection' to 'pages'

title: 'Recent Posts'

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 20

content:
  count: 5  # Limit to 5 most recent posts
  filters:
    folders:
      - posts
    recursive: true
    exclude_future: false
    exclude_past: false
    exclude_featured: false
  order: desc

design:
  view: compact
  columns: '2'

---

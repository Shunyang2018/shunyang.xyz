---
widget: pages  # Change from 'collection' to 'pages'

title: 'Recent Posts'

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 20

content:
  count: 2  # Keep the homepage focused on the latest posts
  filters:
    folders:
      - posts
    recursive: true
    exclude_future: false
    exclude_past: false
    exclude_featured: false
  order: desc

design:
  view: card
  columns: '1'

---

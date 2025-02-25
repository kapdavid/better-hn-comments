# Better HN Comments

A Chrome extension that enhances the Hacker News browsing experience with improved comment navigation and preview features.

## Features

### Comment Navigation

- **Next Button**: Quickly jump to the next top-level comment in a thread
- **Top Button**: Instantly scroll back to the top of the page

### Comment Context

- **Parent Preview**: Hover over "parent ↑" links to see the parent comment without losing your place
- **Grandparent Preview**: Hover over "grandparent ↑↑" links to view the grandparent comment


## Installation


### Manual Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and active when you visit Hacker News

## How It Works

This extension adds two navigation buttons to Hacker News pages:

- A "Top" button that scrolls you back to the top of the page
- A "Next" button that finds and scrolls to the next top-level comment

It also enhances the comment viewing experience by adding hover previews to parent and grandparent comment links, allowing you to quickly view context without jumping around in the thread.

## Permissions

This extension only requires the following permissions:
- `activeTab`: To modify the Hacker News pages you visit
- Access to `news.ycombinator.com`: To run only on Hacker News

It does not collect any user data or track your browsing activity.

## Development

### File Structure

- `manifest.json`: Extension configuration
- `content.js`: Main JavaScript code that runs on Hacker News pages
- `styles.css`: Styling for the added UI elements

### Contributing

Contributions are welcome! Feel free to submit issues or pull requests if you have ideas for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

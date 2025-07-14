# LG TV Factory Diagnostic App

A webOS application for launching LG TV factory diagnostic modes. This app provides a simple interface to access various diagnostic tools built into LG TVs.

## Features

- **TV-Optimized Interface**: Designed for remote control navigation
- **Multiple Diagnostic Modes**: Access to 7 different factory diagnostic tools
- **Real-time Status Feedback**: Visual confirmation of diagnostic launches
- **Cross-Platform webOS Support**: Works with webOS service APIs

### Available Diagnostic Modes

| Mode | Description |
|------|-------------|
| `inStart` | Start Test |
| `inStop` | Stop Test |
| `pCheck` | Picture Check |
| `sCheck` | Sound Check |
| `tilt` | Tilt Adjustment |
| `ezAdjust` | EZ Adjust |
| `powerOnly` | Power Only |

## Prerequisites

- LG TV with webOS
- Developer Mode enabled on your TV
- Network connection between your development machine and TV

## Installation

### Method 1: Using the Install Script (Recommended)

1. Update the TV IP address in `install.sh` if needed:
   ```bash
   TV_IP="192.168.20.23"  # Change to your TV's IP
   ```

2. Run the install script:
   ```bash
   ./install.sh
   ```

### Method 2: Manual Installation

1. **Build the app** using Docker:
   ```bash
   ./build.sh
   ```

2. **Install on TV** using webOS CLI:
   ```bash
   # Install webOS CLI if not already installed
   npm install -g @webos-tools/cli
   
   # Add your TV as a device
   ares-setup-device
   
   # Install the app
   ares-install --device [TV_NAME] com.factory.diagnostic_1.0.0_all.ipk
   ```

### Method 3: SSH Installation

```bash
# Copy IPK to TV
scp com.factory.diagnostic_1.0.0_all.ipk root@[TV_IP]:/tmp/

# Install via SSH
ssh root@[TV_IP] "luna-send -n 1 'luna://com.webos.appInstallService/dev/install' '{\"id\":\"com.factory.diagnostic\",\"ipkUrl\":\"/tmp/com.factory.diagnostic_1.0.0_all.ipk\",\"subscribe\":false}'"
```

## Usage

1. **Launch the app** from your TV's app menu
2. **Navigate** using TV remote arrow keys (↑↓←→)
3. **Select** diagnostic mode using OK/Enter button
4. **Monitor status** at the bottom of the screen

## Development

### Project Structure

```
lg-app/
├── appinfo.json     # App manifest and permissions
├── index.html       # Main UI layout
├── app.js          # Application logic and webOS integration
├── style.css       # TV-optimized styling
├── build.sh        # Docker build script
├── install.sh      # Automated installation script
└── icon.png        # App icon
```

### Key Technical Details

- **webOS API Integration**: Uses both `window.webOS.service` and `window.PalmServiceBridge` for compatibility
- **Luna Service Calls**: Communicates with `luna://com.webos.applicationManager` to launch diagnostics
- **Permissions**: Requires `application.operation` permission for app launching
- **Error Handling**: Comprehensive error handling with user feedback

### Building from Source

```bash
# Clone the repository
git clone [repository-url]
cd lg-app

# Build the app
./build.sh

# Install on your TV
./install.sh
```

## Troubleshooting

### Common Issues

1. **"webOS not available" error**
   - Ensure app has proper permissions in `appinfo.json`
   - Check that TV is in Developer Mode
   - Verify network connectivity

2. **Build failures**
   - Ensure Docker is running
   - Check that all source files are present

3. **Installation failures**
   - Verify TV IP address is correct
   - Ensure SSH access is working
   - Check that TV has sufficient storage

### Debugging

The app includes console logging for debugging:
- Check TV logs via SSH: `journalctl -f`
- Enable web inspector on TV for browser debugging
- Status messages are displayed in the UI

## License

This project is provided as-is for educational and diagnostic purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Disclaimer

This application is for diagnostic purposes only. Use responsibly and ensure you understand the implications of running factory diagnostic modes on your TV.
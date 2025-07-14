#!/bin/bash

# Configuration
TV_IP="192.168.20.23"
TV_USER="root"
TV_PASS="alpine"
APP_ID="ie.ianduffy.lg-diagnostic"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}LG TV Diagnostic Tools Installer${NC}"
echo "=========================================="

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}Error: sshpass is required but not installed${NC}"
    echo "Install with: brew install sshpass"
    exit 1
fi

# Step 1: Build the app
echo -e "${YELLOW}Step 1: Building app...${NC}"
if ./build.sh; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 2: Find the IPK file
IPK_FILE=$(find . -name "*.ipk" -type f | head -n 1)
if [ -z "$IPK_FILE" ]; then
    echo -e "${RED}✗ No IPK file found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found IPK file: $IPK_FILE${NC}"

# Step 3: Copy IPK to TV
echo -e "${YELLOW}Step 2: Copying IPK to TV...${NC}"
if sshpass -p "$TV_PASS" scp "$IPK_FILE" "$TV_USER@$TV_IP:/tmp/"; then
    echo -e "${GREEN}✓ IPK copied to TV${NC}"
else
    echo -e "${RED}✗ Failed to copy IPK to TV${NC}"
    exit 1
fi

# Step 4: Install app on TV
echo -e "${YELLOW}Step 3: Installing app on TV...${NC}"
INSTALL_CMD="luna-send -n 1 'luna://com.webos.appInstallService/dev/install' '{\"id\":\"$APP_ID\",\"ipkUrl\":\"/tmp/$(basename $IPK_FILE)\",\"subscribe\":false}'"

if sshpass -p "$TV_PASS" ssh "$TV_USER@$TV_IP" "$INSTALL_CMD"; then
    echo -e "${GREEN}✓ App installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install app${NC}"
    exit 1
fi

# Step 5: Verify installation
echo -e "${YELLOW}Step 4: Verifying installation...${NC}"
VERIFY_CMD="luna-send -n 1 'luna://com.webos.applicationManager/listApps' '{}' | grep -q '$APP_ID'"

if sshpass -p "$TV_PASS" ssh "$TV_USER@$TV_IP" "$VERIFY_CMD"; then
    echo -e "${GREEN}✓ App verified in TV app list${NC}"
    echo ""
    echo -e "${GREEN}Installation complete!${NC}"
    echo "You can now launch the Factory Diagnostic app from your TV's app menu."
else
    echo -e "${YELLOW}⚠ App installed but verification failed${NC}"
    echo "Check the TV app menu manually."
fi

# Clean up temp file on TV
echo -e "${YELLOW}Cleaning up...${NC}"
sshpass -p "$TV_PASS" ssh "$TV_USER@$TV_IP" "rm -f /tmp/$(basename $IPK_FILE)"
echo -e "${GREEN}✓ Cleanup complete${NC}"
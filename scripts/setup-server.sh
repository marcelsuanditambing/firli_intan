#!/usr/bin/env bash
# One-time Ubuntu 24.04 server preparation: Docker, firewall, fail2ban.
# Run as a sudo-capable user:  sudo ./scripts/setup-server.sh
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Please run with sudo/root."; exit 1; }

echo "### Updating system"
apt-get update -y && apt-get upgrade -y

echo "### Installing Docker Engine + Compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

echo "### Firewall (UFW): allow SSH, HTTP, HTTPS"
apt-get install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "### fail2ban (brute-force protection for SSH)"
apt-get install -y fail2ban
systemctl enable --now fail2ban

echo "### Automatic security updates"
apt-get install -y unattended-upgrades
dpkg-reconfigure -f noninteractive unattended-upgrades || true

echo "Done. Log out/in so your user can run docker, then deploy."

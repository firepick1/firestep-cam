#!/bin/bash

echo
echo "CMD	: `pwd`/scripts/prereq.sh"
echo "INFO	: Installing prerequisites"
echo "INFO	: `date`"

if [ "$SUDO_USER" != "" ]; then
  echo "ERROR	: This script must be run by non-root user"
  echo "TRY	:   scripts/prereq.sh"
  exit -1
fi

read -p "WARN	: This script invokes sudo to change your system. Type \"y\" to proceed: " SUDOOK
if [ "$SUDOOK" != "y" ]; then
	exit -1;
fi


if [ "$(type -p firestep)" == "" ]; then
	echo "INFO	: Installing firestep..."
	if [ ! -e FireStep ]; then
		git clone https://github.com/firepick1/FireStep
	fi
	pushd FireStep
	./build
	sudo make install
	popd
fi

if [ "$(type -p node)" == "" ]; then
	echo "INFO	: Installing nodejs"
	sudo apt-get install -y nodejs
fi

echo "DONE	: prerequisites installed."

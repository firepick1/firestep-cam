#!/bin/bash

echo
echo "CMD	: `pwd`/prereq.sh"
echo "INFO	: Installing prerequisites for firestep-cam"
echo "INFO	: `date`"

if [ "$SUDO_USER" != "" ]; then
  echo "ERROR	: This script must be run by non-root user"
  echo "TRY	:   ./prereq.sh"
  exit -1
fi

read -p "WARN	: This script invokes sudo to change your system. Type \"y\" to proceed: " SUDOOK
if [ "$SUDOOK" != "y" ]; then
	exit -1;
fi


if [ "$(type -p firestep)" == "" ]; then
	echo "INSTALL	: firestep"
	git clone https://github.com/firepick1/FireStep
	pushd FireStep
	./build
	popd
fi
if [ "$(type -p n)" == "" ]; then
	echo "INSTALL	: nodejs"
fi

echo "DONE	: prerequisites installed."

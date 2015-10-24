#!/bin/bash

echo -e "\nSTART\t: `pwd`/$0\t `date`"

if [ "$SUDO_USER" != "" ]; then
  echo "ERROR	: This script must be run by non-root user"
  echo "TRY	:   scripts/install.sh"
  exit -1
fi

read -p "WARN	: This script may use sudo to change your system. Type \"y\" to proceed: " SUDOOK
if [ "$SUDOOK" != "y" ]; then
    echo -e "END\t: `pwd`/$0 (CANCELLED)"
	exit -1;
fi

##################### firestep
if [ "$(type -p firestep)" == "" ]; then
	echo "INFO	: Installing firestep..."
    pushd cli
    ./build
    sudo make install
	RC=$?; if [ $RC != 0 ]; then echo "ERROR	: installation failed ($RC)"; exit -1; fi
	popd
fi
echo -e "INFO\t: firestep `firestep --version`"

####################### nodejs
if [ "$(type -p node)" == "" ]; then
	echo "INFO	: Installing nodejs..."
	sudo apt-get install -y nodejs npm
	RC=$?; if [ $RC != 0 ]; then echo "ERROR	: installation failed ($RC)"; exit -1; fi
fi
echo -e "INFO\t: node `node --version`"
echo -e "CMD\t: npm install"
npm install

######################## END
echo -e "END\t: `pwd`/$0 (COMPLETE) `date`"

######################## build
scripts/build


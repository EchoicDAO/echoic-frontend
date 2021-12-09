import Web3 from 'web3';

const web3 = new Web3(window['ethereum'] || window['web3']);

interface providerState {
  store: {
    network: {
      id: number;
      name: string;
      updated: number;
    };
    account: {
      address: string;
      balance: {
        ftm: number;
        ech: number;
      };
      updated: number;
    };
    connection: {
      status: boolean;
      updated: number;
    };
  };
}

export const state = () => ({
  store: {
    network: {
      id: null,
      name: null,
      updated: null,
    },
    account: {
      address: '',
      balance: {
        ftm: 0,
        ech: 0,
      },
      updated: null,
    },
    connection: {
      status: false,
      updated: null,
    },
  },
});

export const actions = {
  async intializeStore({ dispatch }: { state: providerState; dispatch: any }) {
    if (localStorage.getItem('connected') && localStorage.getItem('connected') === 'true') {
      dispatch('intializeConnection');
    }
  },
  async intializeNetwork({ commit }: { state: providerState; commit: any }) {
    try {
      const networkId = await web3.eth.net.getId();
      const networkName = await web3.eth.net.getNetworkType();

      const data = {
        id: networkId,
        name: networkName,
      };

      commit('setNetwork', data);
    } catch (err) {
      console.error(err);
    }
  },
  async switchNetwork() {
    try {
      try {
        await (web3.currentProvider as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xfa' }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await (web3.currentProvider as any).request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xfa',
                  chainName: 'Fantom Opera',
                  rpcUrls: ['https://rpc.ftm.tools'],
                  nativeCurrency: {
                    name: 'Fantom',
                    symbol: 'FTM',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://ftmscan.com'],
                },
              ],
            });
          } catch (error) {
            alert(error.message);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
  async intializeConnection({
    commit,
    dispatch,
    getters,
  }: {
    state: providerState;
    commit: any;
    dispatch: any;
    getters: any;
  }) {
    let connect;

    if (getters.getNetwork.id === 250 || getters.getNetwork.id === 4002) {
      if (localStorage.getItem('connected') === 'true') {
        try {
          connect = await web3.eth.getAccounts();
        } catch (err) {
          connect = [];
        }
      } else {
        try {
          connect = await web3.eth.requestAccounts();
        } catch (err) {
          connect = [];
        }
      }

      try {
        if (connect.length > 0) {
          commit('setConnection', 'true');
          setTimeout(function () {
            dispatch('intializeAccount', connect[0]);
          }, 1000);

          return true;
        } else {
          commit('setConnection', 'false');
          setTimeout(function () {
            dispatch('intializeAccount', null);
          }, 1000);

          this.$router.go(0);
          return false;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      commit('setConnection', 'false');
      setTimeout(function () {
        dispatch('intializeAccount', null);
      }, 1000);

      return false;
    }
  },

  async intializeAccount(
    { rootState, commit, getters }: { rootState: any; state: providerState; commit: any; getters: any },
    account: any
  ) {
    try {
      let data;

      if (account) {
        const balanceFTM = await web3.eth.getBalance(account);

        const tokenContract = new web3.eth.Contract(
          [
            {
              constant: true,
              inputs: [{ name: '_owner', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ name: 'balance', type: 'uint256' }],
              type: 'function',
            },
          ],
          process.env.TOKEN_CONTRACT
        );

        const balanceECH = await tokenContract.methods.balanceOf(account).call();

        data = {
          address: account,
          balance: {
            ftm: balanceFTM,
            ech: balanceECH,
          },
        };
      } else {
        data = {
          address: '',
          balance: 0,
        };
      }

      commit('setAccount', data);
    } catch (err) {
      console.error(err);
    }
  },
};

export const mutations = {
  async setNetwork(state: providerState, data: any) {
    if (data) {
      state.store.network.id = data.id;
      state.store.network.name = data.name;
      state.store.network.updated = Date.now();

      localStorage.setItem('networkId', data.id);
      localStorage.setItem('networkName', data.name);
    }
  },
  async setConnection(state: providerState, data: string) {
    if (data) {
      state.store.connection.status = JSON.parse(data);
      state.store.connection.updated = Date.now();

      localStorage.setItem('connected', data);
    }
  },
  async setAccount(state: providerState, data: any) {
    if (data) {
      state.store.account.address = data.address;
      state.store.account.balance = data.balance;
      state.store.account.updated = Date.now();

      localStorage.setItem('accountAddress', data.address);
      localStorage.setItem('accountBalance', data.balance);
    }
  },
};

export const getters = {
  getNetwork: (state: providerState) => {
    return state.store.network;
  },
  getAccount: (state: providerState) => {
    return state.store.account;
  },
  isConnected: (state: providerState) => {
    return state.store.connection.status;
  },
};

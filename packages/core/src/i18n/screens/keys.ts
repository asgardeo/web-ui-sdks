/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Interface for the i18n keys.
 */
interface Keys {
  common: {
    copyright: string;
    error: string;
    or: string;
    prefix: {
      register: string;
    };
    privacy: {
      policy: string;
    };
    register: string;
    site: {
      title: string;
    };
    terms: {
      of: {
        service: string;
      };
    };
  };
  emailOtp: {
    continue: string;
    email: {
      otp: {
        heading: string;
      };
    };
    enter: {
      verification: {
        code: {
          got: {
            by: {
              device: string;
            };
          };
        };
      };
    };
    resend: {
      code: string;
    };
  };
  login: {
    button: string;
    enter: {
      your: {
        password: string;
        username: string;
      };
    };
    login: {
      heading: string;
    };
    password: string;
    remember: {
      me: string;
    };
    retry: string;
    username: string;
  };
  totp: {
    continue: string;
    enroll: {
      message1: string;
      message2: string;
    };
    enter: {
      verification: {
        code: {
          got: {
            by: {
              device: string;
            };
          };
        };
      };
    };
    heading: string;
  };
}

export const keys: Keys = {
  common: {
    copyright: 'common.copyright',
    error: 'common.error',
    or: 'common.or',
    prefix: {
      register: 'common.prefix.register',
    },
    privacy: {
      policy: 'common.privacy.policy',
    },
    register: 'common.register',
    site: {
      title: 'common.site.title',
    },
    terms: {
      of: {
        service: 'common.terms.of.service',
      },
    },
  },
  emailOtp: {
    continue: 'emailOtp.continue',
    email: {
      otp: {
        heading: 'emailOtp.email.otp.heading',
      },
    },
    enter: {
      verification: {
        code: {
          got: {
            by: {
              device: 'emailOtp.enter.verification.code.got.by.device',
            },
          },
        },
      },
    },
    resend: {
      code: 'emailOtp.resend.code',
    },
  },
  login: {
    button: 'login.login.button',
    enter: {
      your: {
        password: 'login.enter.your.password',
        username: 'login.enter.your.username',
      },
    },
    login: {
      heading: 'login.login.heading',
    },
    password: 'login.password',
    remember: {
      me: 'login.remember.me',
    },
    retry: 'login.retry',
    username: 'login.username',
  },
  totp: {
    continue: 'totp.continue',
    enroll: {
      message1: 'totp.totp.enroll.message1',
      message2: 'totp.totp.enroll.message2',
    },
    enter: {
      verification: {
        code: {
          got: {
            by: {
              device: 'totp.enter.verification.code.got.by.device',
            },
          },
        },
      },
    },
    heading: 'totp.totp.heading',
  },
};

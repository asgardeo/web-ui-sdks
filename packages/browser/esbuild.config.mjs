/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { readFileSync } from 'fs';
import * as esbuild from 'esbuild';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Get dependencies excluding crypto-related ones that need to be bundled
const externalDeps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
  .filter(dep => !['crypto-browserify', 'randombytes', 'buffer'].includes(dep));

// Plugin to alias crypto and buffer modules
const polyfillPlugin = {
  name: 'polyfill-plugin',
  setup(build) {
    // Crypto polyfill
    build.onResolve({ filter: /^crypto$/ }, () => ({
      path: require.resolve('crypto-browserify')
    }));
    
    // Buffer polyfill
    build.onResolve({ filter: /^buffer$/ }, () => ({
      path: require.resolve('buffer/')
    }));
  }
};

const commonOptions = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: externalDeps,
  platform: 'browser',
  target: ['es2020'],
  define: {
    global: 'globalThis', // Required by crypto-browserify
    'process.env.NODE_DEBUG': 'false',
    'process.version': '"16.0.0"',
    'process.browser': 'true'
  },
  banner: {
    js: `
      import { Buffer } from 'buffer/';
      if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = Buffer;
      }
    `
  },
  footer: {
    js: `
      if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = require('buffer/').Buffer;
      }
    `
  },
  plugins: [polyfillPlugin]
};

await esbuild.build({
  ...commonOptions,
  format: 'esm',
  outfile: 'dist/index.js',
  sourcemap: true
});

await esbuild.build({
  ...commonOptions,
  format: 'cjs',
  outfile: 'dist/cjs/index.js',
  sourcemap: true
});

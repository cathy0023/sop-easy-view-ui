#!/usr/bin/env node

/**
 * CDN 部署脚本
 * 用于将构建后的文件部署到 CDN 服务器
 * 
 * 使用方法：
 * 1. 配置 CDN 服务器信息（见下方配置）
 * 2. 运行: node scripts/deploy-cdn.js
 * 
 * 或者使用环境变量：
 * CDN_HOST=your-cdn-host.com CDN_PATH=/megaview-ui node scripts/deploy-cdn.js
 */

import { readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// CDN 配置（请根据实际情况修改）
const CDN_CONFIG = {
  // CDN 主机地址
  host: process.env.CDN_HOST || 'cdn.yourdomain.com',
  // CDN 路径
  path: process.env.CDN_PATH || '/megaview-ui',
  // 版本号（从 package.json 读取）
  version: JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8')).version,
  // 协议
  protocol: process.env.CDN_PROTOCOL || 'https',
};

// 需要部署的文件
const FILES_TO_DEPLOY = [
  'megaview-ui.es.js',
  'megaview-ui.umd.js',
  'megaview-ui.iife.js',
];

/**
 * 检查文件是否存在
 */
function checkFiles() {
  console.log('📦 检查构建文件...');
  const missingFiles = [];
  
  for (const file of FILES_TO_DEPLOY) {
    const filePath = join(distDir, file);
    try {
      const stats = statSync(filePath);
      console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    } catch (err) {
      missingFiles.push(file);
      console.log(`  ✗ ${file} (未找到)`);
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('\n❌ 错误：以下文件未找到，请先运行 npm run build');
    process.exit(1);
  }
  
  console.log('\n✅ 所有文件检查通过\n');
}

/**
 * 生成 CDN URL
 */
function generateCDNUrls() {
  const baseUrl = `${CDN_CONFIG.protocol}://${CDN_CONFIG.host}${CDN_CONFIG.path}`;
  const version = CDN_CONFIG.version;
  
  console.log('📋 CDN URL 信息：');
  console.log(`\n版本: ${version}`);
  console.log(`\nES Module:`);
  console.log(`  ${baseUrl}/${version}/megaview-ui.es.js`);
  console.log(`\nUMD:`);
  console.log(`  ${baseUrl}/${version}/megaview-ui.umd.js`);
  console.log(`\nIIFE:`);
  console.log(`  ${baseUrl}/${version}/megaview-ui.iife.js`);
  console.log(`\n使用示例:`);
  console.log(`  <script type="module" src="${baseUrl}/${version}/megaview-ui.es.js"></script>`);
  console.log(`\n`);
}

/**
 * 生成部署清单
 */
function generateDeployManifest() {
  const manifest = {
    version: CDN_CONFIG.version,
    timestamp: new Date().toISOString(),
    files: FILES_TO_DEPLOY.map(file => ({
      name: file,
      path: `${CDN_CONFIG.path}/${CDN_CONFIG.version}/${file}`,
      size: statSync(join(distDir, file)).size,
    })),
    cdn: {
      host: CDN_CONFIG.host,
      protocol: CDN_CONFIG.protocol,
      baseUrl: `${CDN_CONFIG.protocol}://${CDN_CONFIG.host}${CDN_CONFIG.path}`,
    },
  };
  
  return manifest;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 MegaviewUI CDN 部署准备\n');
  console.log('='.repeat(50));
  
  // 检查文件
  checkFiles();
  
  // 显示 CDN URL
  generateCDNUrls();
  
  // 生成部署清单
  const manifest = generateDeployManifest();
  console.log('📄 部署清单:');
  console.log(JSON.stringify(manifest, null, 2));
  console.log('\n');
  
  console.log('📝 下一步操作：');
  console.log('1. 将 dist 目录下的文件上传到 CDN 服务器');
  console.log(`2. 确保文件路径为: ${CDN_CONFIG.path}/${CDN_CONFIG.version}/`);
  console.log('3. 配置 CORS 头: Access-Control-Allow-Origin: *');
  console.log('4. 启用 Gzip 压缩以优化性能');
  console.log('5. 测试 CDN URL 是否可以正常访问\n');
  
  console.log('💡 提示：');
  console.log('- 可以使用 rsync、scp 或 FTP 工具上传文件');
  console.log('- 建议使用 CI/CD 自动化部署流程');
  console.log('- 上传前确保已运行 npm run build\n');
}

// 运行主函数
main();



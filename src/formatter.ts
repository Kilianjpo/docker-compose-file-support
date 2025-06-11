import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';

// Define types for Docker Compose structure
interface DockerComposeService {
    image?: string;
    build?: string | { context?: string; dockerfile?: string; args?: Record<string, string> };
    ports?: string[];
    volumes?: string[];
    environment?: Record<string, string> | string[];
    depends_on?: string[];
    networks?: string[] | Record<string, { aliases?: string[] }>;
    deploy?: Record<string, unknown>;
    labels?: Record<string, string>;
    [key: string]: unknown; // Allow other properties
}

interface DockerCompose {
    version?: string;
    services?: Record<string, DockerComposeService>;
    volumes?: Record<string, unknown>;
    networks?: Record<string, unknown>;
    configs?: Record<string, unknown>;
    secrets?: Record<string, unknown>;
    [key: string]: unknown; // Allow other top-level properties
}

const DOCKER_COMPOSE_ORDER = [
    'version',
    'services',
    'volumes',
    'networks',
    'configs',
    'secrets'
];

const SERVICE_PROPERTY_ORDER = [
    'image',
    'build',
    'ports',
    'volumes',
    'environment',
    'depends_on',
    'networks',
    'deploy',
    'labels'
];

export function formatDocument(document: vscode.TextDocument): string {
    const text = document.getText();
    const composeObject = yaml.load(text) as DockerCompose;
    
    if (!composeObject || typeof composeObject !== 'object') {
        return text;
    }

    // Order top-level keys
    const orderedCompose = _.pick(composeObject, DOCKER_COMPOSE_ORDER) as DockerCompose;
    
    // Order service properties if services exist
    if (orderedCompose.services) {
        const orderedServices: Record<string, DockerComposeService> = {};
        // Sort services alphabetically
        const serviceNames = Object.keys(orderedCompose.services).sort();
        
        for (const serviceName of serviceNames) {
            const service = orderedCompose.services[serviceName];
            if (service && typeof service === 'object') {
                orderedServices[serviceName] = _.pick(service, SERVICE_PROPERTY_ORDER) as DockerComposeService;
                
                // Sort arrays alphabetically where it makes sense
                if (Array.isArray(orderedServices[serviceName].ports)) {
                    orderedServices[serviceName].ports!.sort();
                }
                if (Array.isArray(orderedServices[serviceName].volumes)) {
                    orderedServices[serviceName].volumes!.sort();
                }
                if (orderedServices[serviceName].environment && 
                    typeof orderedServices[serviceName].environment === 'object' &&
                    !Array.isArray(orderedServices[serviceName].environment)) {
                    orderedServices[serviceName].environment = 
                        _.fromPairs(_.toPairs(orderedServices[serviceName].environment).sort());
                }
            }
        }
        
        orderedCompose.services = orderedServices;
    }

    // Convert back to YAML with nice formatting
    return yaml.dump(orderedCompose, {
        indent: 2,
        lineWidth: -1, // No line wrapping
        sortKeys: false // We're handling ordering ourselves
    });
}
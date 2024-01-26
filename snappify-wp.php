<?php
/**
 * Plugin Name: Snappify WP
 * Description: Provides a Gutenberg block for embedding snaps
 * Version: 1.0.0
 */

function snappify_register_proxy_endpoint() {
    register_rest_route('snappify', '/fetch/', array(
        'methods' => 'GET',
        'callback' => 'snappify_handle_proxy_request',
        'permission_callback' => '__return_true',
    ));
}

add_action('rest_api_init', 'snappify_register_proxy_endpoint');

function snappify_handle_proxy_request($request) {
    $snap_url = $request->get_param('snap');
    if (!$snap_url) {
        return new WP_Error('no_snap_url', 'No snap url provided', array('status' => 400));
    }

    if(stripos($snap_url, "https://snappify.com") !== 0) {
        return new WP_Error('invalid_url', 'URL must start with https://snappify.com');
    }

    $external_url = 'https://api.snappify.com/oembed?url=' . $snap_url;

    $response = wp_remote_get($external_url);
    if (is_wp_error($response)) {
        return $response;
    }

    $body = wp_remote_retrieve_body($response);
    return rest_ensure_response($body);
}
function snappify_register_block() {
    register_block_type( __DIR__ );
}
add_action( 'init', 'snappify_register_block' );